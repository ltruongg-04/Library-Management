export default function NotificationHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold">
          Notifications
        </h1>

        <p className="text-gray-500 mt-2">
          Stay updated with your library activity and AI recommendations.
        </p>
      </div>

      <button className="text-primary-600 font-medium hover:underline">
        Mark all as read
      </button>
    </div>
  );
}