export type LoadCommentsOutputDto = {
  count: number;
  comments: Array<{
    id: string;
    authorName: string;
    content: string;
    updatedAt: Date;
  }>;
};
