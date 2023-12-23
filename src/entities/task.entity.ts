import { UserInterface } from "./user.entity";

export interface TaskInterface {
  key?: string;
  // @ApiProperty({ description: "UUID" })
  UUID: string;
  // @ApiProperty({ description: "标题" })
  title?: string;
  // @ApiProperty({ description: "创建者" })
  creator: UserInterface;
  // @ApiProperty({ description: "负责人" })
  assignee?: UserInterface[];
  // @ApiProperty({ description: "详细" })
  description?: string;
  // @ApiProperty({ description: "子任务" })
  sub_task?: TaskInterface[];
  // @ApiProperty({ description: "评论内容" })
  comment?: CommentInterface[];
  // @ApiProperty({ description: "关注者" })
  follower?: UserInterface[];
  // @ApiProperty({ description: "任务开始时间" })
  start_date?: Date;
  // @ApiProperty({ description: "任务截止时间" })
  due_date?: Date;
  // @ApiProperty({ description: '任务状态' })
  status?: string;
  // @ApiProperty({ description: "任务创建时间" })
  createdAt?: Date;
  // @ApiProperty({ description: "任务更新时间" })
  updatedAt?: Date;
}

interface CommentInterface {
  description: string;
  user?: UserInterface;
  createdAt: Date;
  updatedAt: Date;
}
