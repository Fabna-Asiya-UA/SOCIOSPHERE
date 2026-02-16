from django.urls import path
from .views import (RegisterView,CommentDeleteView, PostDeleteView,
                        PostListCreateView,
                        CommentCreateView,
                        FollowUnfollowView,
                        MyProfileView,
                        UserProfileView,
                        UpdateProfileView,
                        SearchUserView,
                        ShareCreateView,
                        toggle_like,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
   
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('posts/', PostListCreateView.as_view(), name='posts'),
    path('comments/', CommentCreateView.as_view(), name='comment'),
    path("share/", ShareCreateView.as_view()),
    path("comments/<int:pk>/delete/", CommentDeleteView.as_view()),
    path("posts/<int:pk>/delete/", PostDeleteView.as_view()),
    path("posts/<int:post_id>/like/", toggle_like),

    path("profile/<str:username>/follow/", FollowUnfollowView.as_view()),

    path('profile/', MyProfileView.as_view(), name='profile'),
    path("profile/update/", UpdateProfileView.as_view()),
    path('profile/<str:username>/', UserProfileView.as_view(), name='user_profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='update_profile'),
    path("search/", SearchUserView.as_view()),
    path('follow/<str:username>/', FollowUnfollowView.as_view()),
    path('unfollow/<str:username>/', FollowUnfollowView.as_view()),
]
