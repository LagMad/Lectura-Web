<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of the reviews.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $reviews = Review::with(['book', 'user'])
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    /**
     * Show the form for creating a new review.
     *
     * @param  int  $bookId
     * @return \Inertia\Response
     */
    public function create($bookId = null)
    {
        $book = null;
        $books = [];
        
        if ($bookId) {
            $book = Book::findOrFail($bookId);
        } else {
            $books = Book::all();
        }
        
        return Inertia::render('Reviews/Create', [
            'book' => $book,
            'books' => $books,
        ]);
    }

    /**
     * Store a newly created review in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10',
        ]);

        $review = Review::create([
            'book_id' => $request->book_id,
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return redirect()->route('books.show', $review->book_id)
            ->with('success', 'Review added successfully!');
    }

    /**
     * Display the specified review.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        $review = Review::with(['book', 'user'])->findOrFail($id);
        
        return Inertia::render('Reviews/Show', [
            'review' => $review
        ]);
    }

    /**
     * Show the form for editing the specified review.
     *
     * @param  int  $id
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function edit($id)
    {
        $review = Review::findOrFail($id);
        
        // Check if the authenticated user is the owner of this review
        if ($review->user_id != Auth::id()) {
            return redirect()->back()->with('error', 'You are not authorized to edit this review.');
        }
        
        return Inertia::render('Reviews/Edit', [
            'review' => $review
        ]);
    }

    /**
     * Update the specified review in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        
        // Check if the authenticated user is the owner of this review
        if ($review->user_id != Auth::id()) {
            return redirect()->back()->with('error', 'You are not authorized to update this review.');
        }
        
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10',
        ]);

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return redirect()->route('books.show', $review->book_id)
            ->with('success', 'Review updated successfully!');
    }

    /**
     * Remove the specified review from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        
        // Check if the authenticated user is the owner of this review
        if ($review->user_id != Auth::id()) {
            return redirect()->back()->with('error', 'You are not authorized to delete this review.');
        }
        
        $bookId = $review->book_id;
        $review->delete();

        return redirect()->route('books.show', $bookId)
            ->with('success', 'Review deleted successfully!');
    }

    /**
     * Display reviews for a specific book.
     *
     * @param  int  $bookId
     * @return \Inertia\Response
     */
    public function bookReviews($bookId)
    {
        $book = Book::findOrFail($bookId);
        $reviews = Review::where('book_id', $bookId)
            ->with('user')
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Reviews/BookReviews', [
            'book' => $book,
            'reviews' => $reviews
        ]);
    }

    /**
     * Display reviews by the authenticated user.
     *
     * @return \Inertia\Response
     */
    public function myReviews()
    {
        $reviews = Review::where('user_id', Auth::id())
            ->with('book')
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Reviews/MyReviews', [
            'reviews' => $reviews
        ]);
    }
}