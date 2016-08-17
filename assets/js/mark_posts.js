$(function() {
  function Post(id, checked) {
      this.id = id;
      this.checked = checked;
    }

    function PostsCollection() {
      this.posts = [];
      this.init();
    }

    PostsCollection.prototype = {
      checkPost: function(e) {
        var $label = $(e.target),
            $post = $label.closest("article"),
            $excerpt = $post.find(".article-excerpt"),
            post_id = $label.data("id");

        this.toggleRead($excerpt);
        this.updatePostsArray(post_id);
      },
      updatePostsArray: function(id) {
        var idx = this.posts.indexOf(id);

        if (idx === -1) {
          this.posts.push(id);
        } else  {
          this.posts.splice(idx, 1);
        }
      },
      toggleRead: function(el) {
        el.toggleClass("checked");
      },
      addClickedPostToRead: function(e) {
        var $title = $(e.target),
            $article = $title.closest(".article-list"),
            post_id = $article.data("id");

            this.updatePostsArray(post_id);

      },
      markReadPosts: function() {
        var self = this;

        this.posts.forEach(function(post_id) {
          $(".article-list").each(function(article) {
            var $excerpt = $(this).find(".article-excerpt"),
                $checkbox = $(this).find("input");

            if ($(this).data("id") === post_id) {
              $checkbox.prop("checked", true);
              $excerpt.addClass("checked");
            }
          });
        });
      },
      setLocalStorage: function() {
        localStorage.setItem("posts", JSON.stringify(this.posts));
      },
      getLocalStorage: function() {
        this.posts = JSON.parse(localStorage.getItem("posts")) || [];
      },
      bindEvents: function() {
        $(".right-side-content").on("click", ".toggle-read label", this.checkPost.bind(this));
        $(".right-side-content").on("click", ".post-title", this.addClickedPostToRead.bind(this));
        $(window).on("unload", this.setLocalStorage.bind(this));
        $(window).on("load", this.getLocalStorage.bind(this));
      },
      init: function() {
        this.bindEvents();
        this.getLocalStorage();
        this.markReadPosts();
      }
    };


    function setLocalStorageToggle(boolean) {
      localStorage.setItem("toggle", JSON.stringify(boolean));
    }

    function clearLocalStoragePosts() {
      localStorage.removeItem("posts");
    }

    function showCheckBoxes() {
      $(".toggle-read").show().css({ 'width': '35px' });
      $(".article-excerpt").css({ 'width': "80%" });
      // Posts.markReadPosts();
    }

    function hideCheckBoxes() {
      $("input[name='check-read']").filter(":checked").prop("checked", false);
      $(".toggle-read").hide().width(0);
      $(".article-excerpt").removeClass("checked").css({ "width": "100%" });
    }

    function toggleCheckBoxes() {
      if ($("#myonoffswitch").prop("checked")) {
        hideCheckBoxes();
        Posts.posts = [];
        setLocalStorageToggle(false)
        clearLocalStoragePosts();
      } else {
        showCheckBoxes();
        setLocalStorageToggle(true);
        console.log(localStorage.toggle);
      }

    }

    var Posts = new PostsCollection();

    $(".onoffswitch-label").off().on("mouseup", toggleCheckBoxes);

    var toggle_state = JSON.parse(localStorage.getItem("toggle"));

    if (toggle_state == false) {
      $("#myonoffswitch").click()
      hideCheckBoxes();

    };


  });

// 1. check the state of the toggle property from local storage,
//     if doesn't exist, set to true,
//     else set checked property to false