import { Request, Response, NextFunction } from 'express';
import { sendChat, ChatMessage } from '../services/chat.service';

export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages, system, previewOnly } = req.body as {
      messages: ChatMessage[];
      system?: string;
      previewOnly?: boolean;
    };

    const result = await sendChat(messages, system, Boolean(previewOnly));
    res.json(result);
  } catch (err) {
    next(err);
  }
};
