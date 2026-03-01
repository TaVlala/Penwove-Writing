import React from 'react';
import CommentSection from './CommentSection';

function SidebarComponent({
  activeCommentId,
  setActiveCommentId,
  contributions,
  user,
  onAddComment
}) {
  if (!activeCommentId) return null;

  const contrib = contributions.find(c => c.id === activeCommentId);
  if (!contrib) return null;

  return (
    <aside className="comment-sidebar">
      <div className="comment-sidebar-header">
        <h3>Comments</h3>
        <button className="close-btn" onClick={() => setActiveCommentId(null)}>×</button>
      </div>
      <div className="comment-sidebar-body">
        <CommentSection
          contributionId={contrib.id}
          comments={contrib.comments || []}
          currentUser={user}
          onAddComment={onAddComment}
        />
      </div>
    </aside>
  );
}

export default React.memo(SidebarComponent);
