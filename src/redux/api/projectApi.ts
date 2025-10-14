import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const ProjectApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProject: build.mutation({
      query: (data) => ({
        url: "/projects",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.projects],
    }),

    getAllProjects: build.query({
      // query: (arg: Record<string, any>) => ({
      query: () => ({
        url: "/projects",
        method: "GET",
        // params: arg,
      }),
      providesTags: [tagTypes.projects],
    }),

    getSingleProject: build.query({
      query: (projectId) => (
        console.log("singleId", projectId),
        {
          url: `/projects/${projectId}`,
          method: "GET",
        }
      ),
    }),

    updateProject: build.mutation({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.projects],
    }),

    deleteProject: build.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.projects],
    }),
  }),
});

export const {
    useCreateProjectMutation,
    useGetAllProjectsQuery,
    useGetSingleProjectQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation
} = ProjectApi;
