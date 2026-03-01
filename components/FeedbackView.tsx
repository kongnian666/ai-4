import React, { useState } from 'react';
import { Feedback } from '../types';
import { MessageSquare, Send } from 'lucide-react';

interface FeedbackViewProps {
  feedbacks: Feedback[];
  onSubmit: (content: string, type: 'bug' | 'suggestion' | 'other') => void;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ feedbacks, onSubmit }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'bug' | 'suggestion' | 'other'>('suggestion');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content, type);
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">
         <h2 className="text-3xl font-bold mb-2 flex items-center">
            <MessageSquare className="mr-3" />
            用户反馈
         </h2>
         <p className="text-teal-50">帮助我们改进系统，您的意见对我们很重要。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Form */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">提交反馈</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">反馈类型</label>
                    <div className="flex gap-2">
                        {(['suggestion', 'bug', 'other'] as const).map(t => (
                            <button
                                type="button"
                                key={t}
                                onClick={() => setType(t)}
                                className={`px-4 py-2 rounded-lg text-sm capitalize ${type === t ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {t === 'suggestion' ? '建议' : t === 'bug' ? 'Bug反馈' : '其他'}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">详细内容</label>
                    <textarea 
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[120px]"
                        placeholder="请描述您遇到的问题或建议..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    ></textarea>
                </div>
                <button 
                    type="submit"
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                    <Send size={18} className="mr-2" /> 提交
                </button>
            </form>
         </div>

         {/* List */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col max-h-[500px]">
            <h3 className="text-lg font-bold text-slate-800 mb-4">反馈记录</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {feedbacks.length === 0 && <p className="text-slate-400 text-center py-8">暂无反馈</p>}
                {feedbacks.map(fb => (
                    <div key={fb.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                             <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                                 fb.type === 'bug' ? 'bg-red-100 text-red-600' : 
                                 fb.type === 'suggestion' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
                             }`}>
                                 {fb.type === 'suggestion' ? '建议' : fb.type === 'bug' ? 'BUG' : '其他'}
                             </span>
                             <span className="text-xs text-slate-400">{fb.timestamp.toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{fb.content}</p>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default FeedbackView;
