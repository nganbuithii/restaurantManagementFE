import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { authApi, endpoints } from '@/app/configs/API';
import { useSelector } from 'react-redux';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatisticsFeedback = () => {
    const [feedbackStats, setFeedbackStats] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchFeedbackStats = async () => {
            try {
                const response = await authApi(token).post(endpoints.statisticFeedback);
                setFeedbackStats(response.data.data);
            } catch (error) {
                console.error('Error fetching feedback statistics:', error);
            }
        };

        fetchFeedbackStats();
    }, [token]);

    if (!feedbackStats) return <p>Loading...</p>;

    const pieChartData = feedbackStats.labelStats.map(stat => ({
        name: stat.label || 'Unknown',
        value: stat.totalFeedbacks
    }));

    const barChartData = feedbackStats.labelStats.map(stat => ({
        name: stat.label || 'Unknown',
        averageRating: stat.averageRating,
        totalRating: stat.totalRating
    }));

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Feedback Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Feedback Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Ratings by Label</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="averageRating" fill="#8884d8" name="Average Rating" />
                            <Bar dataKey="totalRating" fill="#82ca9d" name="Total Rating" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Overall Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{feedbackStats.totalFeedbacks}</p>
                        <p className="text-gray-600">Total Feedbacks</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{feedbackStats.averageRating.toFixed(2)}</p>
                        <p className="text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{feedbackStats.totalRating}</p>
                        <p className="text-gray-600">Total Rating</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {feedbackStats.totalPositive} / {feedbackStats.totalNegative}
                        </p>
                        <p className="text-gray-600">Positive / Negative</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsFeedback;