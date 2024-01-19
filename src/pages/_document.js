import { Html, Head, Main, NextScript } from 'next/document'
import { useEffect } from 'react'

export default function Document() {

  useEffect(()=>{
    var win = navigator.platform.indexOf('Win') > -1;
    if (win && document.querySelector('#sidenav-scrollbar')) {
      var options = {
        damping: '0.5'
      }
      Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
    }
  })

  return (
    <Html lang="fr">
      <Head>
        <link rel="apple-touch-icon" sizes="76x76" href={"/assets/img/apple-icon.png"} />
        <link rel="icon" type="image/png" href={"/assets/img/logo.png"} />

        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700|Noto+Sans:300,400,500,600,700,800|PT+Mono:300,400,500,600,700" rel="stylesheet" />

        <link href={"/assets/css/nucleo-icons.css"} rel="stylesheet" />
        <link href={"/assets/css/nucleo-svg.css"} rel="stylesheet" />

        <script src="https://kit.fontawesome.com/349ee9c857.js" crossOrigin="anonymous"></script>
        <link href={"/assets/css/nucleo-svg.css"} rel="stylesheet" />

        <link id="pagestyle" href={"/assets/css/corporate-ui-dashboard.css?v=1.0.0"} rel="stylesheet" />
      </Head>
      <body className='g-sidenav-show  bg-gray-100'>

        <Main />
        <NextScript />

        <script src={"/assets/js/core/popper.min.js"}></script>
        <script src={"/assets/js/core/bootstrap.min.js"}></script>
        <script src={"/assets/js/plugins/perfect-scrollbar.min.js"}></script>
        <script src={"/assets/js/plugins/smooth-scrollbar.min.js"}></script>
        <script src={"/assets/js/plugins/chartjs.min.js"}></script>
        <script src={"/assets/js/plugins/swiper-bundle.min.js"} type="text/javascript"></script>

        
  <script async defer src="https://buttons.github.io/buttons.js"></script>
  
  <script src={"/assets/js/corporate-ui-dashboard.min.js?v=1.0.0"}></script>

      </body>
    </Html>
  )
}
