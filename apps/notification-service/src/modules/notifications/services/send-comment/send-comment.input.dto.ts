export type SendCommentInputDto = {
  taskId: string;
  comment: {
    id: string;
    authorName: string;
    content: string;
    updatedAt: Date;
  };
};
