export type LoadCommentsOutputDto = {
  count: number;
  comments: Array<{
    authorName: string;
    content: string;
  }>;
};
