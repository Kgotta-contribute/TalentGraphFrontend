import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem
} from "~/components/Accordion";
import ScoreBadge from "~/components/ScoreBadge";

interface CategoryDetail {
    title: string;
    id: string;
    score: number;
    tips: {
        type: "good" | "improve";
        tip: string;
        explanation: string;
    }[];
}

const CategorySection = ({ category }: { category: CategoryDetail }) => {
    return (
        <AccordionItem id={category.id} className="border border-gray-100 rounded-xl mb-3 bg-white shadow-xs overflow-hidden">
            <AccordionHeader itemId={category.id} className="hover:bg-gray-50/50">
                <div className="flex items-center justify-between w-full pr-2">
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-800">{category.title}</span>
                        <ScoreBadge score={category.score} />
                    </div>
                    <span className="text-lg font-bold text-gray-700">{category.score}/100</span>
                </div>
            </AccordionHeader>
            <AccordionContent itemId={category.id}>
                <div className="flex flex-col gap-4 pt-1 pb-3">
                    {category.tips && category.tips.length > 0 ? (
                        category.tips.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 bg-gray-50/80 p-3.5 rounded-xl">
                                <img
                                    src={item.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                                    alt={item.type === "good" ? "Check" : "Warning"}
                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                />
                                <div className="flex flex-col gap-1">
                                    <h4 className={`text-base font-semibold ${item.type === "good" ? "text-green-800" : "text-amber-800"}`}>
                                        {item.tip}
                                    </h4>
                                    {item.explanation && (
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {item.explanation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No specific tips available.</p>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
    const categories: CategoryDetail[] = [
        {
            title: "Tone & Style",
            id: "toneAndStyle",
            score: feedback?.toneAndStyle?.score || 0,
            tips: feedback?.toneAndStyle?.tips || [],
        },
        {
            title: "Content",
            id: "content",
            score: feedback?.content?.score || 0,
            tips: feedback?.content?.tips || [],
        },
        {
            title: "Structure",
            id: "structure",
            score: feedback?.structure?.score || 0,
            tips: feedback?.structure?.tips || [],
        },
        {
            title: "Skills",
            id: "skills",
            score: feedback?.skills?.score || 0,
            tips: feedback?.skills?.tips || [],
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Detailed Feedback</h3>
            <Accordion allowMultiple={true} defaultOpen="toneAndStyle">
                {categories.map((cat) => (
                    <CategorySection key={cat.id} category={cat} />
                ))}
            </Accordion>
        </div>
    );
};

export default Details;
