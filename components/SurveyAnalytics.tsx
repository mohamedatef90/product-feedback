

import React, { useState, useMemo } from 'react';
import { Project, SurveyResponse, SurveyQuestion } from '../types';

// A set of common English "stop words" to be excluded from the word cloud.
const STOP_WORDS = new Set(['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now', 'app', 'feature', 'like', 'use', 'would', 'get']);


interface RatingChartProps {
    data: {
        label: string;
        counts: Record<number, number>;
        totalRatings: number;
        average: number;
    };
}

const RatingChart: React.FC<RatingChartProps> = ({ data }) => {
    const { label, counts, totalRatings, average } = data;
    // FIX: Cast Object.values(counts) to number[] to resolve TypeScript error where it was inferred as unknown[].
    const maxCount = Math.max(1, ...Object.values(counts) as number[]);

    if (totalRatings === 0) {
        return (
            <div className="bg-black/5 p-4 rounded-xl border border-white/20">
                <h4 className="font-semibold text-foreground mb-2">{label}</h4>
                <p className="text-muted-foreground text-sm">No rating data available for this question.</p>
            </div>
        )
    }

    const ratingLevels = [
        { label: '5 Stars', value: 5 },
        { label: '4 Stars', value: 4 },
        { label: '3 Stars', value: 3 },
        { label: '2 Stars', value: 2 },
        { label: '1 Star', value: 1 },
    ];

    return (
        <div className="bg-black/5 p-4 rounded-xl border border-white/20">
            <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-foreground max-w-xs">{label}</h4>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-xl text-primary">{average.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Avg. Rating ({totalRatings} votes)</p>
                </div>
            </div>
            <div className="space-y-2">
                {ratingLevels.map(level => (
                    <div key={level.value} className="flex items-center gap-2 text-sm">
                        <span className="w-16 text-muted-foreground text-right">{level.label}</span>
                        <div className="flex-grow bg-black/10 rounded-full h-4">
                            <div
                                className="bg-gradient-to-r from-system-blue to-cyan-400 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${(counts[level.value] / maxCount) * 100}%` }}
                            />
                        </div>
                        <span className="w-8 text-foreground font-medium text-left">{counts[level.value]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface WordCloudProps {
    data: { word: string; count: number }[];
}

const WordCloud: React.FC<WordCloudProps> = ({ data }) => {
    if (data.length === 0) {
        return (
            <div className="p-4 text-center min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">No open-ended feedback available to generate a word cloud.</p>
            </div>
        );
    }
    
    const minCount = data.length > 0 ? data[data.length - 1].count : 1;
    const maxCount = data.length > 0 ? data[0].count : 1;

    const getFontSize = (count: number) => {
        if (maxCount === minCount) return '1rem';
        const minSize = 0.8; // rem
        const maxSize = 2.5; // rem
        // Use a non-linear scale to make differences more apparent
        const size = minSize + (maxSize - minSize) * Math.pow((count - minCount) / (maxCount - minCount), 0.5);
        return `${size}rem`;
    };
    
    const colors = ['text-primary', 'text-system-purple', 'text-foreground', 'text-system-orange', 'text-system-green'];

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-6 min-h-[200px]">
            {data.map(({ word, count }, index) => (
                <span 
                    key={word}
                    className={`${colors[index % colors.length]} font-bold transition-all duration-300 hover:scale-110`}
                    style={{ fontSize: getFontSize(count) }}
                    title={`${count} mentions`}
                >
                    {word}
                </span>
            ))}
        </div>
    );
};


interface SurveyAnalyticsProps {
    responses: SurveyResponse[];
    projects: Project[];
    questions: SurveyQuestion[];
}

const SurveyAnalytics: React.FC<SurveyAnalyticsProps> = ({ responses, projects, questions }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

    const filteredResponses = useMemo(() => {
        if (selectedProjectId === 'all') {
            return responses;
        }
        return responses.filter(r => r.project_id === selectedProjectId);
    }, [responses, selectedProjectId]);

    const ratingAnalytics = useMemo(() => {
        const ratingQuestions = questions.filter(q => q.type === 'rating');
        
        return ratingQuestions.map(question => {
            const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            let totalRatings = 0;
            let sumOfRatings = 0;

            filteredResponses.forEach(response => {
                const answer = response.answers[question.id];
                if (typeof answer === 'number' && answer >= 1 && answer <= 5) {
                    counts[answer]++;
                    totalRatings++;
                    sumOfRatings += answer;
                }
            });

            const average = totalRatings > 0 ? (sumOfRatings / totalRatings) : 0;
            
            return {
                id: question.id,
                label: question.label,
                counts,
                totalRatings,
                average
            };
        });
    }, [filteredResponses, questions]);

    const wordCloudData = useMemo(() => {
        const textareaQuestionIds = new Set(questions.filter(q => q.type === 'textarea').map(q => q.id));
        
        const allText = filteredResponses.map(response => 
            Object.entries(response.answers)
                .filter(([questionId, answer]) => textareaQuestionIds.has(questionId) && typeof answer === 'string' && answer.trim() !== '')
                .map(([, answer]) => answer as string)
                .join(' ')
        ).join(' ');

        if (!allText.trim()) {
            return [];
        }

        const words = allText
            .toLowerCase()
            .replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ")
            .split(/\s+/);

        const wordFrequencies: { [key: string]: number } = {};
        words.forEach(word => {
            if (word && word.length > 2 && !STOP_WORDS.has(word)) {
                wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
            }
        });
        
        return Object.entries(wordFrequencies)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 75); // Top 75 words
    }, [filteredResponses, questions]);

    const selectedProjectName = selectedProjectId === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProjectId)?.name;

    return (
        <div className="space-y-8">
            <div className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl p-5 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                    Viewing Analytics for: <span className="text-primary">{selectedProjectName}</span>
                </h3>
                <div>
                    <label htmlFor="project-filter" className="sr-only">Filter by project</label>
                    <select
                        id="project-filter"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="all">All Projects</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredResponses.length > 0 ? (
                <>
                    {/* Rating Analysis */}
                    <div className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Rating Questions Analysis</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {ratingAnalytics.length > 0 ? ratingAnalytics.map(data => (
                                <RatingChart key={data.id} data={data} />
                            )) : <p className="text-muted-foreground col-span-full">No rating questions in this survey.</p>}
                        </div>
                    </div>

                    {/* Word Cloud */}
                    <div className="bg-white/40 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl p-6">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Open-Ended Feedback Word Cloud</h3>
                        <WordCloud data={wordCloudData} />
                    </div>
                </>
            ) : (
                 <div className="text-center py-16 bg-white/20 backdrop-blur-lg border border-white/20 rounded-2xl">
                    <p className="text-muted-foreground text-xl">No survey data available for the selected project. 📝</p>
                </div>
            )}
        </div>
    );
};

export default SurveyAnalytics;