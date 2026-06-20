import React, { useState } from 'react';
import { mockUsersList } from '../api/mockData';
import { Search, Download, Filter } from 'lucide-react';
import { cn } from '../../../lib/utils';

type Tab = 'Students' | 'Teachers' | 'Departments';

export const ManagementTableWidget = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Students');
  const [search, setSearch] = useState('');

  const filteredData = mockUsersList.filter(user => 
    (activeTab === 'Students' ? user.role === 'Student' : activeTab === 'Teachers' ? user.role === 'Teacher' : true) &&
    (user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Data Management</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
              <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm hidden sm:flex">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-6 border-b border-gray-100">
          {(['Students', 'Teachers', 'Departments'] as Tab[]).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 text-sm font-medium transition-all relative",
                activeTab === tab ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto flex-grow">
        {activeTab !== 'Departments' ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{user.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-md text-xs font-semibold",
                      user.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Edit</button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No records found matching "{search}"</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-gray-300" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Department Management</h4>
            <p className="text-sm">This module is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};
