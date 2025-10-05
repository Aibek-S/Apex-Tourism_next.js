import { useState } from "react";
import AnimatedButton from "./AnimatedButton";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../hooks/useFeedback";
import Link from "next/link";

interface FeedbackSectionProps {
  placeId: number;
}

export default function FeedbackSection({ placeId }: FeedbackSectionProps) {
    const { user } = useAuth();
    const {
        feedback,
        loading,
        error,
        addFeedback,
        getAverageRating,
        getRatingDistribution,
    } = useFeedback(placeId);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [feedbackError, setFeedbackError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setFeedbackError(
                "Пожалуйста, войдите в систему, чтобы оставить отзыв"
            );
            return;
        }

        if (rating === 0) {
            setFeedbackError("Пожалуйста, поставьте оценку");
            return;
        }

        setSubmitting(true);
        setFeedbackError("");

        try {
            await addFeedback({
                userId: user.id,
                rating,
                comment,
            });

            // Reset form
            setRating(0);
            setComment("");
        } catch (err: any) {
            setFeedbackError("Ошибка при отправке отзыва: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = getAverageRating();
    const ratingDistribution = getRatingDistribution();

    // Function to render star ratings
    const renderStars = (ratingValue: number, size = "medium") => {
        const stars = [];
        const starSize =
            size === "large" ? "24px" : size === "medium" ? "20px" : "16px";

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        color: i <= ratingValue ? "#FFD700" : "#ddd",
                        fontSize: starSize,
                        cursor: "pointer",
                    }}
                    onClick={() => setRating(i)}
                >
                    ★
                </span>
            );
        }

        return stars;
    };

    // Function to render star ratings for display only
    const renderStaticStars = (ratingValue: number, size = "medium") => {
        const stars = [];
        const starSize =
            size === "large" ? "24px" : size === "medium" ? "20px" : "16px";

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        color: i <= ratingValue ? "#FFD700" : "#ddd",
                        fontSize: starSize,
                    }}
                >
                    ★
                </span>
            );
        }

        return stars;
    };

    return (
        <div className="feedback-section">
            <h3>Отзывы посетителей</h3>

            {/* Average Rating Display */}
            <div className="average-rating">
                <div className="rating-value">
                    <span className="rating-number">{averageRating}</span>
                    <div className="stars">
                        {renderStaticStars(Math.round(averageRating), "large")}
                    </div>
                    <span className="rating-count">
                        ({feedback.length} отзывов)
                    </span>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map((starCount) => (
                    <div key={starCount} className="rating-bar">
                        <span className="star-label">{starCount} ★</span>
                        <div className="bar-container">
                            <div
                                className="bar"
                                style={{
                                    width:
                                        feedback.length > 0
                                            ? `${(ratingDistribution[starCount] / feedback.length) * 100}%`
                                            : "0%",
                                }}
                            ></div>
                        </div>
                        <span className="count">
                            {ratingDistribution[starCount]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Feedback Form */}
            {user ? (
                <div className="feedback-form-container">
                    <h4>Оставить отзыв</h4>
                    <form onSubmit={handleSubmit} className="feedback-form">
                        {feedbackError && (
                            <div className="error-message">{feedbackError}</div>
                        )}

                        <div className="form-group">
                            <label>Ваша оценка:</label>
                            <div className="star-rating">
                                {renderStars(rating)}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment">Ваш комментарий:</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Поделитесь своими впечатлениями..."
                                rows={4}
                            />
                        </div>

                        <AnimatedButton
                            type="submit"
                            disabled={submitting}
                            className="btn"
                        >
                            {submitting ? "Отправка..." : "Отправить отзыв"}
                        </AnimatedButton>
                    </form>
                </div>
            ) : (
                <div className="login-prompt">
                    <p>
                        Пожалуйста, <Link href="/login">войдите</Link> или{" "}
                        <Link href="/signup">зарегистрируйтесь</Link>, чтобы оставить
                        отзыв.
                    </p>
                </div>
            )}

            {/* Feedback List */}
            <div className="feedback-list">
                <h4>Отзывы посетителей</h4>

                {loading ? (
                    <div className="loading">Загрузка отзывов...</div>
                ) : error ? (
                    <div className="error-message">
                        Ошибка загрузки отзывов: {error}
                    </div>
                ) : feedback.length === 0 ? (
                    <p className="no-feedback">
                        Пока нет отзывов. Будьте первым!
                    </p>
                ) : (
                    <div className="feedback-items">
                        {feedback.map((item) => (
                            <div key={item.id} className="feedback-item">
                                <div className="feedback-header">
                                    <div className="user-info">
                                        <div className="avatar">
                                            <div className="avatar-placeholder">
                                                👤
                                            </div>
                                        </div>
                                        <div className="user-details">
                                            <span className="user-name">
                                                {item.users?.full_name ||
                                                    "Анонимный пользователь"}
                                            </span>
                                            <div className="rating">
                                                {renderStaticStars(item.rating)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="date">
                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString("ru-RU")}
                                    </div>
                                </div>
                                {item.comment && (
                                    <div className="comment">
                                        {item.comment}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}