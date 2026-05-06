import { Trash2, Edit2, Plus } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">QC Guidelines</h1>
          <p className="text-gray-500 text-sm">Configure the criteria used to evaluate customer service interactions</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Guideline
        </button>
      </div>

      <div className="space-y-4">
        {/* Placeholder for your actual content */}
        <div className="bg-white p-6 rounded-xl border flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-sm">Professional Greeting <span className="text-gray-400 ml-2">Weight: 6/10</span></h3>
            <p className="text-xs text-gray-600 mt-1">Agent must greet the customer professionally...</p>
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-black"><Edit2 size={16} /></button>
            <button className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}