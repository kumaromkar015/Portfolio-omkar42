import { Schema, model, Document } from "mongoose";

export interface IGithubRepoConfig extends Document {
  repoName: string; // The repository name (slug)
  isVisible: boolean;
  isFeatured: boolean;
  displayOrder: number;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const githubRepoConfigSchema = new Schema<IGithubRepoConfig>(
  {
    repoName: { type: String, required: true, unique: true },
    isVisible: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

githubRepoConfigSchema.index({ displayOrder: 1 });

export const GithubRepoConfig = model<IGithubRepoConfig>("GithubRepoConfig", githubRepoConfigSchema);
