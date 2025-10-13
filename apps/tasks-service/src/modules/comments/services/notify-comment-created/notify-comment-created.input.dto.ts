export type NotifyCommentCreatedInputDto = {
  task: {
    id: string;
    title: string;
    releatedUsersId: string[];
  };
  comment: {
    id: string;
    authorName: string;
    content: string;
    updatedAt: Date;
  };
};
