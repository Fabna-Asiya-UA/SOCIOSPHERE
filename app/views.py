from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Post,Like, Comment, Profile,Share
from .serializers import (UserSerializer,PostSerializer,CommentSerializer,ProfileSerializer,ShareSerializer)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveAPIView

class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)



class UserProfileView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        username = self.kwargs["username"]
        user = User.objects.get(username=username)
        return Profile.objects.get(user=user)


class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile




class SearchUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.GET.get("q", "")

        users = User.objects.filter(username__icontains=query)

        results = []
        for user in users:
            profile, _ = Profile.objects.get_or_create(user=user)

            results.append({
                "id": user.id,
                "username": user.username,
                "bio": profile.bio,
                "followers_count": profile.followers.count(),
            })

        return Response(results)




class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer




class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by("-created_at")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




class FollowUnfollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        target_user = User.objects.get(username=username)
        profile = Profile.objects.get(user=target_user)

        if request.user in profile.followers.all():
            profile.followers.remove(request.user)
            return Response({"message": "Unfollowed"})
        else:
            profile.followers.add(request.user)
            return Response({"message": "Followed"})
        
class ShareCreateView(generics.CreateAPIView):
    queryset = Share.objects.all()
    serializer_class = ShareSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PostDeleteView(generics.DestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)


class CommentDeleteView(generics.DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user)
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
    post = Post.objects.get(id=post_id)
    user = request.user

    like, created = Like.objects.get_or_create(user=user, post=post)

    if not created:
        like.delete()
        return Response({"message": "Unliked"})

    return Response({"message": "Liked"})