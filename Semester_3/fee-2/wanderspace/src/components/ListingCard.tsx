/**
 * ListingCard Component
 * ------------------------------------------------------------
 * Reusable card displaying property thumbnail, title, location,
 * real SQL-calculated rating, price, and wishlist toggle button.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Listing } from '../types';
import { useWishlist } from '../hooks/useWishlist';
import { StarRatingDisplay } from './StarRating';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(listing.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    toggleWishlist(listing.id);
  };

  return (
    <article className="listing-card">
      {/* Thumbnail with Heart Action and Category Badge */}
      <div className="card-image-wrap">
        <Link to={`/listings/${listing.id}`}>
          <img
            src={listing.image}
            alt={listing.title}
            className="card-image"
            loading="lazy"
            onError={(e) => {
              // Fallback image in case the remote photo URL fails
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleHeartClick}
          className={`heart-btn ${wishlisted ? 'active' : ''}`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={18}
            className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Category Pill Tag */}
        {listing.category && (
          <span className="category-tag">{listing.category}</span>
        )}
      </div>

      {/* Card Details */}
      <div className="card-body">
        <div className="card-header-row">
          <Link to={`/listings/${listing.id}`} className="card-title">
            {listing.title}
          </Link>
          {/* Real calculated rating from SQL */}
          <StarRatingDisplay
            rating={listing.avg_rating}
            reviewCount={listing.review_count}
          />
        </div>

        <div className="card-location">
          <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
          {listing.location}, {listing.country}
        </div>

        <div className="card-price-row">
          <div>
            <span className="price-val">${Number(listing.price).toLocaleString()}</span>
            <span className="price-unit"> / night</span>
          </div>

          <Link
            to={`/listings/${listing.id}`}
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#fe424d',
              textDecoration: 'none',
            }}
          >
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
};
