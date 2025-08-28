'use client';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function ExploreSearch({ value, onChange }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-4 shadow">
      <label className="block text-sm mb-2">Search projects & offers</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by project name, category, subcategory, or offer description…"
        className="w-full px-4 py-3 rounded-xl bg-[#e7e7e7] text-[#2c3d5a] placeholder-[#2c3d5a]/60"
      />
    </div>
  );
}
