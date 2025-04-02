import { MessageSquareDashed } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-12 bg-base-100">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center shadow-md">
            <MessageSquareDashed className="w-8 h-8 text-base-content/60" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-base-content">No conversation selected</h2>
        <p className="text-base text-base-content/60">
          To get started, choose a person or conversation from the sidebar.
        </p>
        <p className="text-sm text-base-content/40 italic">
          Or just relax... until someone starts talking.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
