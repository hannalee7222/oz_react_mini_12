import { useCallback, useEffect, useRef, useState } from 'react';
import { OTT_PROVIDERS } from '../utils/ottProviders';

export default function OttFilter({ selectedOtts, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  //바깥 클릭 시 드롭다운 닫혀지게끔
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProvider = useCallback(
    (id) => {
      if (selectedOtts.includes(id)) {
        onChange(selectedOtts.filter((x) => x !== id));
      } else {
        onChange([...selectedOtts, id]);
      }
    },
    [selectedOtts, onChange]
  );

  const handleRemoveChip = useCallback(
    (id) => {
      onChange(selectedOtts.filter((x) => x !== id));
    },
    [selectedOtts, onChange]
  );

  return (
    <div className="mb-4">
      {/*선택된 ott칩 */}
      {selectedOtts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOtts.map((id) => {
            const provider = OTT_PROVIDERS.find((p) => p.id === id);
            const label = provider?.label ?? id;
            return (
              <button
                key={id}
                type="button"
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-700 text-xs text-white hover:bg-purple-600"
                onClick={() => handleRemoveChip(id)}
              >
                <span>{label}</span>
                <span className="text-[10px]">x</span>
              </button>
            );
          })}
        </div>
      )}

      {/*드롭다운 버튼 */}
      <div className="relative inline-block" ref={containerRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="px-3 py-1 text-sm rounded-md border border-gray-500 bg-white text-black hover:bg-gray-800 hover:text-white
          dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black
          "
        >
          OTT 필터 선택
        </button>

        {open && (
          <div
            className="absolute mt-2 w-44 rounded-md bg-white text-black border border-gray-300 shadow-lg z-10
          dark:bg-black dark:text-white dark:border-gray-700"
          >
            <ul className="max-h-64 overflow-y-auto py-2 text-sm">
              {OTT_PROVIDERS.map((provider) => (
                <li
                  key={provider.id}
                  className="flex items-center px-3 py-1 gap-2 cursor-pointer hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-black"
                  onClick={() => toggleProvider(provider.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedOtts.includes(provider.id)}
                    className="accent-purple-500"
                    readOnly
                  />
                  <span>{provider.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
