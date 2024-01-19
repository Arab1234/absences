import { signIn, useSession } from 'next-auth/react';
import { useLayoutEffect, useRef } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession()

  const handleSignIn = (provider) => {
    signIn(provider,{callbackUrl: session?.callbackUrl || '/'}); // Redirects to Google login page
  };

  const ref = useRef(null);

  useLayoutEffect(() => {
    ref.current.style.setProperty('background-color', 'rgba(255, 255, 255, 0.35)', 'important');
    ref.current.style.setProperty('backdrop-filter', 'blur(2px) saturate(100%)', 'important');
  }, []);

  return (
    <>
  <div className="container position-sticky z-index-sticky top-0">
    <div className="row">
      <div className="col-12">
        
      </div>
    </div>
  </div>
  <main className="main-content  mt-0">
    <section>
      <div className="page-header min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-md-6 d-flex flex-column mx-auto">
              <img src='./assets/img/logo-ensmr-2.png' style={{filter: 'drop-shadow(1px 1px 1px black) brightness(1.3)',width: '500px'}} />
              <div className="card card-plain mt-8">
                <div className="card-header pb-0 text-left bg-transparent">
                  <h3 className="font-weight-black text-dark display-6">Bonjour</h3>
                  <p className="mb-0">Merci de vous connecter à l'aide de votre email professionnelle <b>@enim.ac.ma</b>.</p>
                </div>
                <div className="card-body">
                  <form role="form">
                    
                    
                    <div className="text-center">
                      <button type="button" className="btn btn-white btn-icon w-100 mb-3" onClick={()=>handleSignIn('google')}>
                        <span className="btn-inner--icon me-1">
                          <img className="w-5" src="../assets/img/logos/google-logo.svg" alt="google-logo" />
                        </span>
                        <span className="btn-inner--text">Connexion avec Google</span>
                      </button>
                    </div>
                    <div style={{height: '340px'}}></div>
                  </form>
                </div>
                <div className="card-footer text-center pt-0 px-lg-2 px-1">
                  <p className="mb-4 text-xs mx-auto">
                  <a href='mailto:mehach@enim.ac.ma' target='_blank'>Pour créer un compte veuillez contacter l'administrateur</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="position-absolute w-40 top-0 end-0 h-100 d-md-block d-none">
                <div className="oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 bg-cover ms-n8" style={{backgroundImage:"url('./assets/img/image-sign-in.jpg')"}}>
                  <div ref={ref} className="blur mt-12 p-4 text-center border border-white border-radius-md position-absolute fixed-bottom m-4">
                    <h2 className="mt-3 text-dark font-weight-bold">Gestion des absences des étudiants de l'ENSMR</h2>
                    <h6 className="text-dark text-sm mt-5">Tous droits réservés © 2023 - <a href='https://enim.ac.ma' target='_blank'><b>ENSMR</b></a>.</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  
  <script src={"./assets/js/core/popper.min.js"}></script>
  <script src={"./assets/js/core/bootstrap.min.js"}></script>
  <script src={"./assets/js/plugins/perfect-scrollbar.min.js"}></script>
  <script src={"./assets/js/plugins/smooth-scrollbar.min.js"}></script>
  
  
  <script async defer src="https://buttons.github.io/buttons.js"></script>
  
  <script src={"./assets/js/corporate-ui-dashboard.min.js?v=1.0.0"}></script>
  </>
  );
}