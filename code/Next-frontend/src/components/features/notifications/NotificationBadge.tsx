interface Props {
  count: number;
}

export default function NotificationBadge({
  count,
}: Props) {
  if (count <= 0) return null;

  return (
    <span
      className="
        absolute
        -top-1
        -right-1
        min-w-[20px]
        h-5
        px-1
        rounded-full
        bg-red-500
        text-white
        text-xs
        flex
        items-center
        justify-center
      "
    >
      {count}
    </span>
  );
}