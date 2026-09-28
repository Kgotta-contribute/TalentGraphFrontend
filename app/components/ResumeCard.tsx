import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const CompanyIcon = ({ name }: { name?: string }) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("microsoft")) {
        return (
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6 flex-shrink-0">
                <span className="w-2.5 h-2.5 bg-[#F25022] rounded-xs" />
                <span className="w-2.5 h-2.5 bg-[#7FBA00] rounded-xs" />
                <span className="w-2.5 h-2.5 bg-[#00A4EF] rounded-xs" />
                <span className="w-2.5 h-2.5 bg-[#FFB900] rounded-xs" />
            </div>
        );
    }
    if (lower.includes("google")) {
        return (
            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
                G
            </div>
        );
    }
    if (lower.includes("apple")) {
        return (
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-800">
                
            </div>
        );
    }
    return (
        <div className="w-6 h-6 rounded-lg bg-indigo-100/70 text-[#6366F1] font-bold text-xs flex items-center justify-center uppercase">
            {(name || "R")[0]}
        </div>
    );
};

interface ResumeCardProps {
    resume: Resume;
    onDelete?: (id: string) => void;
}

const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => {
    const { id, companyName, jobTitle, feedback, imagePath, resumePath, _kvKey } = resume;
    const { fs, kv } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if (!blob || !isMounted) return;
            const url = URL.createObjectURL(blob);
            setResumeUrl(url);
        };

        loadResume();
        return () => {
            isMounted = false;
        };
    }, [imagePath]);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const label = companyName ? `${companyName} (${jobTitle || 'Resume'})` : (jobTitle || 'this resume');
        if (!window.confirm(`Are you sure you want to delete ${label} and all its AI analysis? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            // 1. Delete original resume PDF from Puter fs
            if (resumePath) {
                try {
                    await fs.delete(resumePath);
                } catch (err) {
                    console.warn("Could not delete resume PDF:", resumePath, err);
                }
            }

            // 2. Delete rendered thumbnail image from Puter fs
            if (imagePath) {
                try {
                    await fs.delete(imagePath);
                } catch (err) {
                    console.warn("Could not delete preview image:", imagePath, err);
                }
            }

            // 3. Collect all KV keys to purge (direct ID, prefixed ID, original KV key, and duplicates)
            const keysToDelete = new Set<string>();
            if (_kvKey) keysToDelete.add(_kvKey);
            if (id) {
                keysToDelete.add(id);
                keysToDelete.add(id.startsWith('resume:') ? id : `resume:${id}`);
                keysToDelete.add(id.replace(/^resume:/, ''));
            }

            // Scan all keys in KV to delete all duplicate submissions of this resume
            try {
                const allList = await kv.list('resume:*', true);
                if (Array.isArray(allList)) {
                    for (const item of allList) {
                        const k = typeof item === 'string' ? item : item?.key;
                        const v = typeof item === 'object' && item?.value
                            ? (typeof item.value === 'string' ? item.value : JSON.stringify(item.value))
                            : '';
                        if (!k) continue;

                        if (id && (k.includes(id) || v.includes(id))) {
                            keysToDelete.add(k);
                        }
                        if ((resumePath && v.includes(resumePath)) || (imagePath && v.includes(imagePath))) {
                            keysToDelete.add(k);
                        }
                        if (companyName && jobTitle && v.includes(companyName) && v.includes(jobTitle)) {
                            keysToDelete.add(k);
                        }
                    }
                }
            } catch (scanErr) {
                console.warn("Error scanning KV list for duplicates:", scanErr);
            }

            for (const k of keysToDelete) {
                try {
                    await kv.delete(k);
                    console.log(`Purged KV key: ${k}`);
                } catch (err) {
                    console.warn(`Could not delete KV key ${k}:`, err);
                }
            }

            setIsDeleted(true);
            onDelete?.(id);
        } catch (err) {
            console.error("Failed to delete resume:", err);
            alert("Failed to delete resume. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isDeleted) return null;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100/80 flex flex-col justify-between hover:shadow-md transition-all duration-300 w-full max-w-[490px] h-[370px]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CompanyIcon name={companyName} />
                    <div className="flex flex-col">
                        <h2 className="font-extrabold text-base tracking-wider uppercase text-gray-900 leading-tight">
                            {companyName || "RESUME"}
                        </h2>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
                            {jobTitle || "GENERAL"}
                        </h3>
                    </div>
                </div>

                <ScoreCircle score={feedback?.overallScore ?? 0} size={64} />
            </div>

            {/* Resume Preview Box */}
            <Link to={`/resume/${id}`} className="my-3 block flex-1">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0]/70 rounded-2xl p-2.5 h-[200px] overflow-hidden group">
                    {resumeUrl ? (
                        <div className="w-full h-full rounded-xl overflow-hidden bg-white shadow-2xs border border-gray-100">
                            <img
                                src={resumeUrl}
                                alt="resume preview"
                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Loading preview...
                        </div>
                    )}
                </div>
            </Link>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
                <Link
                    to={`/resume/${id}`}
                    className="text-[#6366F1] hover:text-[#4F46E5] font-semibold text-sm flex items-center gap-1.5 transition-colors"
                >
                    View Details
                    <span className="text-base leading-none">→</span>
                </Link>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer group/del"
                    title="Delete resume & analysis"
                >
                    {isDeleting ? (
                        <svg className="w-4.5 h-4.5 animate-spin text-rose-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 group-hover/del:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ResumeCard;