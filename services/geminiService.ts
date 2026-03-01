import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, User, AttendanceStatus } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeAttendanceData = async (
  records: AttendanceRecord[],
  users: User[],
  monthStr: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "API Key not configured. Unable to generate AI analysis.";
  }

  // Aggregate stats
  const stats = users.map(user => {
    const userRecords = records.filter(r => r.userId === user.id);
    const present = userRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const late = userRecords.filter(r => r.status === AttendanceStatus.LATE).length;
    const absent = userRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
    return `${user.name}: 正常${present}次, 迟到${late}次, 缺勤${absent}次`;
  }).join('\n');

  const prompt = `
    作为一名考勤管理专家，请分析以下 ${monthStr} 的考勤数据，并提供一份简短的总结报告。
    
    数据如下:
    ${stats}
    
    请包含以下内容:
    1. 整体考勤情况概览。
    2. 需要关注的人员名单（缺勤或迟到较多者）。
    3. 一条提高出勤率的简短建议。

    请使用中文回答，格式简洁，支持 Markdown。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze attendance data via Gemini.";
  }
};
