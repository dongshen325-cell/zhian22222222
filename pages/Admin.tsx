
import React from 'react';
import { BarChart3, Users, Globe, Activity, ShieldAlert } from 'lucide-react';
import { Language } from '../types';

const Admin: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 pt-24 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <ShieldAlert className="text-red-500" /> 后台管理控制台
            </h1>
            <p className="text-slate-400">内部访客数据与安全日志（演示专用）</p>
          </div>
          <div className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-mono text-slate-500 border border-slate-700">
            SYSTEM_ID: ZHIAN_DEMO_01
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><Users size={20} /></div>
              <span className="text-xs text-green-500 font-bold">+12% ↑</span>
            </div>
            <div className="text-3xl font-bold mb-1">12,482</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">总访客数</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg"><Activity size={20} /></div>
              <span className="text-xs text-green-500 font-bold">Stable</span>
            </div>
            <div className="text-3xl font-bold mb-1">98.2%</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">新闻真实度评分</div>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg"><Globe size={20} /></div>
              <span className="text-xs text-slate-500 font-bold">5 regions</span>
            </div>
            <div className="text-3xl font-bold mb-1">2,103</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">ZA 积分流通</div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><BarChart3 size={18} /> 实时媒体访客追踪</h3>
            <button className="text-xs text-blue-400 hover:text-blue-300">刷新数据</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-slate-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">IP Address (Hash)</th>
                  <th className="px-6 py-4">地区归属</th>
                  <th className="px-6 py-4">访问来源</th>
                  <th className="px-6 py-4">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {[
                  { ip: '192.168.***.21', region: '亚洲 / 香港', source: 'Reuter News', status: 'Active' },
                  { ip: '103.22.***.105', region: '欧洲 / 柏林', source: 'Die Welt', status: 'Reading' },
                  { ip: '172.16.***.44', region: '北美 / 华盛顿', source: 'Internal Portal', status: 'Voting' },
                  { ip: '45.12.***.99', region: '拉美 / 巴西', source: 'Free Media Network', status: 'Idle' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-blue-400">{item.ip}</td>
                    <td className="px-6 py-4">{item.region}</td>
                    <td className="px-6 py-4">{item.source}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-slate-700 text-slate-400'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
