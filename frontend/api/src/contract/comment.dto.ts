export interface PortfolioCommentDTO {
  id: string;
  message: string;
  status: number;
  createdAt: string;
  hiddenAt: string | null;
  authorFirstname: string | null;
  authorLastname: string | null;
  authorAvatarUrl: string | null;
  authorEmail: string | null;
}

export interface CreatePortfolioCommentDTO {
  firstname?: string;
  lastname?: string;
  message: string;
}