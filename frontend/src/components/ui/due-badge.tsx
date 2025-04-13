export const DueBadge = ({
    icon: Icon,
    text,
  }: {
    icon: React.ElementType;
    text: string;
  }) => (
    <div className="absolute right-10 top-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 z-10 flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {text}
    </div>
  );
  