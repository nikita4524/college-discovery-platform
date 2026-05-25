import { College, Course, Placement, Review, SavedCollege, User } from "@prisma/client";

export type CollegeWithRelations = College & {
  courses: Course[];
  placements: Placement | null;
};

export type CollegeDetail = CollegeWithRelations & {
  reviews: (Review & { user: Pick<User, "id" | "name" | "image"> })[];
  isSaved?: boolean;
};

export type SavedCollegeWithCollege = SavedCollege & {
  college: CollegeWithRelations;
};

export interface CollegesResponse {
  colleges: CollegeWithRelations[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SavedComparison {
  id: string;
  name: string;
  collegeIds: string[];
  createdAt: string;
}
