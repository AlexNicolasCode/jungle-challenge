export type SendCommentInputDto = {
  task: {
    id: string;
    title: string;
  };
  comment: {
    id: string;
    authorName: string;
    content: string;
    updatedAt: Date;
  };
};
