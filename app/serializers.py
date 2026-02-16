from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Comment, Like, Profile, Share


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        Profile.objects.get_or_create(user=user)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    posts = serializers.SerializerMethodField()   # ✅ lowercase

    class Meta:
        model = Profile
        fields = [
            'id',
            'username',
            'email',
            'bio',
            'profile_pic',
            'followers_count',
            'following_count',
            'is_following',
            'posts',  
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.user.following.count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.followers.filter(id=request.user.id).exists()
        return False

    def get_posts(self, obj):
        posts = Post.objects.filter(user=obj.user).order_by('-created_at')
        return PostSerializer(posts, many=True, context=self.context).data
  


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'content', 'created_at']





class PostSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    likes_count = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)  # ✅ FIXED

    class Meta:
        model = Post
        fields = [
            'id',
            'user',
            'content',
            'created_at',
            'likes_count',
            'image',
            'comments'
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()


 
class ShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Share
        fields = "__all__"
        read_only_fields = ["user"]
