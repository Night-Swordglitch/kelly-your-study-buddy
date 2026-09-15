with open('kelly.html', 'r', encoding='utf-8') as f:
    content = f.read()

router_script = """
<script id="kelly-hash-router">
(function () {

  const realShowRoot = window.showRoot;
  const realShowPage = window.showPage;

  const rootHashMap = {
    'view-landing': '',
    'view-login': '#/login',
    'view-signup': '#/signup',
    'view-onboarding': '#/onboarding',
    'view-app': '#/app'
  };

  let currentPage = 'home';
  let isRouting = false;

  window.showRoot = function (viewId) {
    realShowRoot(viewId);
    if (!isRouting) {
      if (viewId === 'view-app') {
        window.location.hash = `#/app/${currentPage}`;
      } else {
        window.location.hash = rootHashMap[viewId] ?? '';
      }
    }
  };

  window.showPage = function (pageId) {
    realShowPage(pageId);
    currentPage = pageId;
    if (!isRouting) {
      window.location.hash = `#/app/${pageId}`;
    }
  };

  function isLoggedIn() {
    return localStorage.getItem('kelly_logged_in') === 'true';
  }

  function router() {
    isRouting = true;
    const hash = window.location.hash;

    if (hash.startsWith('#/app/')) {
      const pageId = hash.replace('#/app/', '') || 'home';
      if (isLoggedIn()) {
        realShowRoot('view-app');
        realShowPage(pageId);
        currentPage = pageId;
      } else {
        realShowRoot('view-login');
        window.location.hash = '#/login';
      }
    } else if (hash === '#/login') {
      realShowRoot('view-login');
    } else if (hash === '#/signup') {
      realShowRoot('view-signup');
    } else if (hash === '#/onboarding') {
      realShowRoot('view-onboarding');
    } else {
      realShowRoot('view-landing');
    }

    isRouting = false;
  }

  window.addEventListener('hashchange', router);
  document.addEventListener('DOMContentLoaded', router);
  if (document.readyState !== 'loading') {
    router();
  }

})();
</script>
"""

marker = '<script src="/KELLY/kelly.js"></script>'

if marker in content:
    content = content.replace(marker, marker + router_script, 1)
    with open('kelly.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Router script inserted successfully.")
else:
    print("Could not find the kelly.js script tag - insertion aborted, file not changed.")
