import {
  CheckCircle,
  FileText,
  Clock,
  XCircle,
  X,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  User,
} from "lucide-react";

const Modal2 = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl signage-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-8 border-b bg-secondary">
          <h2 className="signage-text-medium text-secondary-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-8 overflow-auto max-h-[calc(85vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal2;