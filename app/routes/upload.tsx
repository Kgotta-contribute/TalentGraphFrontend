import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage, extractTextFromPdf} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const MAX_RESUME_QUOTA = 80;

/**
 * Enforces a strict quota of at most 80 resumes in Puter storage.
 * If 80 resumes already exist and a new one is uploaded (the 81st),
 * the oldest resume (PDF, rendered preview image, and KV entry) is pruned first.
 */
async function enforceResumeQuota(kv: any, fs: any, maxAllowed: number = 80) {
    try {
        const listResult = await kv.list('resume:*', true);
        if (!listResult || !Array.isArray(listResult)) return;

        interface ResumeEntry {
            key: string;
            resumePath?: string;
            imagePath?: string;
            timestamp: number;
        }

        const entries: ResumeEntry[] = [];

        for (let i = 0; i < listResult.length; i++) {
            const item = listResult[i];
            let key = '';
            let rawVal = '';

            if (typeof item === 'string') {
                key = item;
                const fetched = await kv.get(key);
                rawVal = fetched || '';
            } else if (item && typeof item === 'object') {
                key = item.key || '';
                rawVal = typeof item.value === 'string' ? item.value : (item.value ? JSON.stringify(item.value) : '');
            }

            if (!key) continue;

            let parsed: any = null;
            try {
                if (rawVal) parsed = JSON.parse(rawVal);
            } catch (e) {
                // If corrupted, treat as oldest
            }

            let timestamp = 0;
            if (parsed?.createdAt) {
                const parsedTime = new Date(parsed.createdAt).getTime();
                if (!isNaN(parsedTime)) timestamp = parsedTime;
            } else {
                // Fallback: items that lack createdAt are older entries
                timestamp = i;
            }

            entries.push({
                key,
                resumePath: parsed?.resumePath,
                imagePath: parsed?.imagePath,
                timestamp,
            });
        }

        // We are uploading 1 new resume. If total count is >= maxAllowed (e.g. 80),
        // we must delete (count - maxAllowed + 1) oldest resumes.
        if (entries.length >= maxAllowed) {
            // Sort ascending by timestamp (oldest first)
            entries.sort((a, b) => a.timestamp - b.timestamp);

            const countToDelete = entries.length - maxAllowed + 1;
            const toDelete = entries.slice(0, countToDelete);

            for (const item of toDelete) {
                // 1. Delete original resume PDF from Puter fs
                if (item.resumePath) {
                    try {
                        await fs.delete(item.resumePath);
                    } catch (err) {
                        console.warn('Could not delete resume PDF:', item.resumePath, err);
                    }
                }
                // 2. Delete preview PNG thumbnail from Puter fs
                if (item.imagePath) {
                    try {
                        await fs.delete(item.imagePath);
                    } catch (err) {
                        console.warn('Could not delete preview image:', item.imagePath, err);
                    }
                }
                // 3. Delete KV entry
                try {
                    await kv.delete(item.key);
                    console.log(`Auto-pruned oldest resume ${item.key} to maintain ${maxAllowed} quota`);
                } catch (err) {
                    console.warn('Could not delete KV key:', item.key, err);
                }
            }
        }
    } catch (e) {
        console.error('Error enforcing resume quota:', e);
    }
}

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    //
    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Checking storage quota (max 80 resumes)...');
        await enforceResumeQuota(kv, fs, MAX_RESUME_QUOTA);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText(`Error: ${imageFile.error || 'Failed to convert PDF to image'}`);

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
            createdAt: new Date().toISOString(),
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Extracting resume content...');
        const resumeText = await extractTextFromPdf(file);

        setStatusText('Analyzing with AI...');
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription, resumeText })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        let feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        feedbackText = feedbackText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

        try {
            data.feedback = JSON.parse(feedbackText);
        } catch (parseErr) {
            console.error("Failed to parse feedback JSON directly, attempting regex extraction:", parseErr, feedbackText);
            const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                data.feedback = JSON.parse(jsonMatch[0]);
            } else {
                return setStatusText('Error: Invalid response format from AI');
            }
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                                {/*<div>Uploader</div>*/}
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload