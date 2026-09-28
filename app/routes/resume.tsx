import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import RecruiterVerdict from "~/components/RecruiterVerdict";
import QuantifiedMetrics from "~/components/QuantifiedMetrics";
import VerbRepetition from "~/components/VerbRepetition";
import BuzzwordsSection from "~/components/BuzzwordsSection";
import CareerArcTimeline from "~/components/CareerArcTimeline";
import MarketSkillGaps from "~/components/MarketSkillGaps";
import PassedChecks from "~/components/PassedChecks";
import InterviewPrep from "~/components/InterviewPrep";

export const meta = () => ([
    { title: 'ResumeIQ | Review' },
    { name: 'description', content: 'Detailed overview of your resume' },
]);

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if (!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({ resumeUrl, imageUrl, feedback: data.feedback });
        };

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0 bg-slate-50/50 min-h-screen pb-16">
            <nav className="resume-nav bg-white">
                <Link to="/" className="back-button hover:bg-gray-50 transition-colors">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                {/* Left Column: Visual Resume Preview */}
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center max-lg:h-auto max-lg:static">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[92%] max-w-xl w-full flex items-center justify-center shadow-lg">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                                <img
                                    src={imageUrl}
                                    alt="Resume preview"
                                    className="w-full h-full object-contain rounded-xl"
                                    title="Click to view full PDF"
                                />
                            </a>
                        </div>
                    )}
                </section>

                {/* Right Column: In-Depth Diagnostic Reports */}
                <section className="feedback-section space-y-6 max-w-3xl overflow-y-auto">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Deep Audit Report</span>
                        <h2 className="text-3xl sm:text-4xl !text-gray-900 font-black tracking-tight">Resume Diagnostic</h2>
                    </div>

                    {feedback ? (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-1000">
                            {/* 1. Score Overview */}
                            <Summary feedback={feedback} />

                            {/* 2. The 7-Second Recruiter Read */}
                            {feedback.recruiterRead && (
                                <RecruiterVerdict recruiterRead={feedback.recruiterRead} />
                            )}

                            {/* 3. ATS Suitability */}
                            <ATS score={feedback?.ATS?.score || 0} suggestions={feedback?.ATS?.tips || []} />

                            {/* 4. Quantified Impact Ratio (X of Y bullets) */}
                            {feedback.quantifiedMetrics && (
                                <QuantifiedMetrics metrics={feedback.quantifiedMetrics} />
                            )}

                            {/* 5. Action Verb Repetition Analyzer */}
                            {feedback.actionVerbRepetition && (
                                <VerbRepetition verbRepetition={feedback.actionVerbRepetition} />
                            )}

                            {/* 6. Vague Buzzwords & Clichés */}
                            {feedback.buzzwords && (
                                <BuzzwordsSection buzzwords={feedback.buzzwords} />
                            )}

                            {/* 7. Career Arc Timeline Scan */}
                            {feedback.careerArc && (
                                <CareerArcTimeline careerArc={feedback.careerArc} />
                            )}

                            {/* 8. Market Skill Gaps */}
                            {feedback.marketSkillGaps && (
                                <MarketSkillGaps skillGaps={feedback.marketSkillGaps} />
                            )}

                            {/* 9. What You Did Well (Passed Checks) */}
                            {feedback.passedChecks && (
                                <PassedChecks passedChecks={feedback.passedChecks} />
                            )}

                            {/* 10. Predictive Interview Trigger Questions */}
                            {feedback.interviewQuestions && (
                                <InterviewPrep questions={feedback.interviewQuestions} />
                            )}

                            {/* 11. Category Breakdown Details */}
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-xs">
                            <img src="/images/resume-scan-2.gif" alt="Scanning resume..." className="w-24 h-24" />
                            <p className="text-sm font-semibold text-gray-600 mt-3">Performing deep recruiter & ATS audit...</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;