/*global angular*/
var app = angular.module('reddit-clone', ['ngRoute', 'firebase']);

app.constant('fbURL', 'https://test-reddit-firebase.firebaseio.com' + '/orders');

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
        if ($scope.authData && post.description &&  post.price) {

            Posts.$add({
                name: $scope.authData.twitter.username,//post.name,
                description: post.description,
                price: post.price,
                votes: 0,
                uid: $scope.authData.uid
            })

            post.name = "";
            post.description = "";
            post.url = "";
            post.price = "";
            post.uid = "";

            alert('Order is done ! Your order is added to the list below.');
        }
        else {
            alert('Besides logging in twitter, all fields should be filled before submitting data!')
        }
    }

    $scope.addVote = function(post) {
        post.votes++;
        Posts.$save(post);
    }

    $scope.deletePost = function(post) {

       // for debugging
       var d = post.uid === $scope.authData.uid;

       // front-end validation
        // if($scope.authData && post.uid === $scope.authData.uid) {
            var postForDeletion = new Firebase(fbURL + '/' + post.$id);
            postForDeletion.remove();
        // }else {
        //     alert("You can only delete your own post !");
        // }
    }

    // $scope.addComment = function(post, comment) {
    //     if($scope.authData){
    //         var ref = new Firebase(fbURL + '/' + post.$id + '/comments');
    //         var sync = $firebase(ref);
    //         $scope.comments = sync.$asArray();
    //         $scope.comments.$add({
    //             user: $scope.authData.twitter.username,
    //             text: comment.text
    //         });
    //     }
    //     else {
    //         alert('You need to be logged in before doing that!');
    //     }
        
    //     comment.text = "";
    // }

    // $scope.removeComment = function(post, comment) {
    //     var commentForDeletion = new Firebase(fbURL + '/' + post.$id + '/comments/' +
    //     comment.$id);
    //     commentForDeletion.remove();
    // }

    $scope.login = function() {
        var ref = new Firebase(fbURL + '/');
        ref.authWithOAuthPopup('twitter', function(error, authData) {
            if(error) {
                alert('Sorry, error');
            }
            
            $scope.authData = authData;
        }, {
            remember: "sessionOnly"
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