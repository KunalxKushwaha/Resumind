import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isWiping, setIsWiping] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    setIsWiping(true);
    for (const file of files) {
      await fs.delete(file.path);
    }
    await kv.flush();
    await loadFiles();
    setIsWiping(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading your workspace…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 px-4 py-12 text-neutral-100">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="
  text-3xl font-semibold tracking-tight
  bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-400
  bg-clip-text text-transparent
  drop-shadow-[0_1px_6px_rgba(255,255,255,0.15)]
">
  Application Data
</h1>

          <p className="mt-2 text-sm text-neutral-400">
            Signed in as <span className="text-neutral-200">{auth.user?.username}</span>
          </p>
        </div>

        {/* Files Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-xl shadow-xl">
          <div className="border-b border-neutral-800 px-6 py-4">
            <h2 className="text-lg font-medium">Stored Files</h2>
            <p className="text-sm text-neutral-400">
              These files are currently stored in your app space
            </p>
          </div>

          <div className="max-h-[260px] overflow-y-auto px-6 py-4">
            {files.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No files found. Your workspace is clean.
              </p>
            ) : (
              <ul className="space-y-3">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 transition hover:border-neutral-700"
                  >
                    <span className="truncate text-sm">{file.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-10 rounded-2xl border border-red-900/40 bg-red-950/30 px-6 py-6">
          <h3 className="text-lg font-semibold text-red-400">
            Danger Zone
          </h3>
          <p className="mt-1 text-sm text-red-300/80">
            This action permanently deletes all app data. This cannot be undone.
          </p>

          <button
            onClick={handleDelete}
            disabled={isWiping || files.length === 0}
            className="
              mt-5 inline-flex items-center justify-center rounded-xl
              bg-red-600 px-6 py-3 text-sm font-medium text-white
              transition-all duration-200
              hover:bg-red-700
              active:scale-[0.97]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {isWiping ? "Wiping Data…" : "Wipe App Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WipeApp;
