/*global angular*/
var app = angular.module('reddit-clone', ['ngRoute', 'firebase']);

app.constant('fbURL', 'https://test-reddit-firebase.firebaseio.com');

app.factory('Posts', function($firebase, fbURL) {
    return $firebase(new Firebase(fbURL)).$asArray();
});

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'MainController',
            templateUrl: 'main.html'
        })
        .otherwise({
            redirectTo: '/'
        })
});

app.controller('MainController', function($scope, $firebase, Posts, fbURL) {

    $scope.postt = { 
        name:"",
        description: ""
        /*price: ""*/ };
        
    $scope.posts = Posts;

    $scope.savePost = function(post) {
        if (post.name && post.description &&  post.price) {

            Posts.$add({
                name: post.name,
                description: post.description,
                price: post.price,
                votes: 0
            })

            post.name = "";
            post.description = "";
            post.url = "";
            post.price = "";

            alert('Order is done ! Your order is added to the list below.');
        }
        else {
            alert('All forms should be filled before summit.')
        }
    }

    $scope.addVote = function(post) {
        post.votes++;
        Posts.$save(post);
    }

    $scope.deletePost = function(post) {
        var postForDeletion = new Firebase(fbURL + '/' + post.$id);
        postForDeletion.remove();
    }

    $scope.addComment = function(post, comment) {
        if($scope.authData){
            var ref = new Firebase(fbURL + '/' + post.$id + '/comments');
            var sync = $firebase(ref);
            $scope.comments = sync.$asArray();
            $scope.comments.$add({
                user: $scope.authData.twitter.username,
                text: comment.text
            });
        }
        else {
            alert('You need to be logged in before doing that!');
        }
        
        comment.text = "";
    }

    $scope.removeComment = function(post, comment) {
        var commentForDeletion = new Firebase(fbURL + '/' + post.$id + '/comments/' +
        comment.$id);
        commentForDeletion.remove();
    }

    $scope.login = function() {
        var ref = new Firebase(fbURL + '/');
        ref.authWithOAuthPopup('twitter', function(error, authData) {
            if(error) {
                alert('Sorry, error');
            }
            else
            alert('Success');
            
            $scope.authData = authData;
        });
    }

    $scope.calculateSum = function() {
        var sum = 0;
        for (i=0; i<Posts.length; i++) {
         sum += Number(Posts[i].price);
        }
         // alert(sum);
        return "$" + sum;
    }
});