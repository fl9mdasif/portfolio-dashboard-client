"use client";

import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
// import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
import { useGetAllProjectsQuery } from "@/redux/api/projectApi";
import { Briefcase, Newspaper } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="p-6 border rounded-lg bg-primary border-border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium ">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className="p-3 rounded-full bg-accent/20 text-accent">{icon}</div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { data: projectsData } = useGetAllProjectsQuery({});
  const { data: blogs } = useGetAllBlogsQuery({});

  // console.log(count(blogsData));

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Projects"
          value={projectsData?.meta?.total}
          icon={<Briefcase className="text-[#d8bb00]" size={24} />}
        />
        <StatCard
          title="Total Blog Posts"
          value={blogs?.meta?.total}
          // value="25"
          icon={<Newspaper className="text-[#d8bb00]" size={24} />}
        />
        {/* Add more cards as needed */}
      </div>
    </div>
  );
};

export default DashboardPage;
