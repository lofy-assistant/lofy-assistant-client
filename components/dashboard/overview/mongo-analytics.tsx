"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    MessageSquare,
    User,
    Bot,
    Calendar as CalendarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MessageAnalytics {
    total: number;
    byUser: number;
    byAssistant: number;
    daysActive: number;
}

export function MongoAnalytics() {
    const [data, setData] = useState<MessageAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const response = await fetch("/api/analytics");
                if (response.ok) {
                    const analyticsData = await response.json();
                    setData(analyticsData.messages);
                }
            } catch (error) {
                console.error("Failed to fetch message analytics:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <Skeleton className="w-24 h-4" />
                            <Skeleton className="w-8 h-8 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-16 h-8 mb-2" />
                            <Skeleton className="w-32 h-3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                        Failed to load message analytics
                    </p>
                </CardContent>
            </Card>
        );
    }

    const stats = [
        {
            title: "Total Messages",
            value: data.total,
            description: "All conversations",
            icon: MessageSquare,
            color: "text-indigo-500",
            bgColor: "bg-indigo-500/10",
        },
        {
            title: "Your Messages",
            value: data.byUser,
            description: "Messages sent by you",
            icon: User,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: "Assistant Messages",
            value: data.byAssistant,
            description: "AI responses",
            icon: Bot,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            title: "Days Active",
            value: data.daysActive,
            description: "Days with messages",
            icon: CalendarIcon,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Message Analytics Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Message Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                        Your conversation statistics
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card
                        className="pt-2 transition-all hover:shadow-md"
                        key={stat.title}
                    >
                        <CardHeader className="flex flex-row items-center space-y-0">
                            <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Additional Insights */}
            {data.total > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Average messages per day</span>
                            <span className="font-semibold">
                                {data.daysActive > 0
                                    ? (data.total / data.daysActive).toFixed(1)
                                    : 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">User/Assistant ratio</span>
                            <span className="font-semibold">
                                {data.byAssistant > 0
                                    ? (data.byUser / data.byAssistant).toFixed(2)
                                    : data.byUser > 0 ? '∞' : '0'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Engagement level</span>
                            <Badge
                                variant={data.daysActive > 7 ? "default" : "indigo"}
                                className="text-xs"
                            >
                                {data.daysActive > 30 ? "High" : data.daysActive > 7 ? "Medium" : "Low"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
