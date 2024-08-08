'use client';
import { Slash } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbsProps {
    labels: string[];
    links: (string | undefined)[];
}

export default function Breadcrumbs({ labels, links }: BreadcrumbsProps) {
    // Kiểm tra nếu labels và links có cùng độ dài
    if (labels.length !== links.length) {
        console.error("The number of labels must match the number of links.");
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {labels.map((label, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            {links[index] ? (
                                <BreadcrumbLink href={links[index]}>{label}</BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < labels.length - 1 && (
                            <BreadcrumbSeparator>
                                <Slash />
                            </BreadcrumbSeparator>
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
