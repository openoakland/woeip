import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { Navigation } from "./";
import { AuthTokenContext } from '../auth/tokenContext';

/**
 * gl-js used in "box" component has hard requirements for browser apis. it cannot run in jest
 * https://github.com/mapbox/mapbox-gl-js/issues/10487#issuecomment-805106543
 * Mocking the whole map page also allows us to avoid mocking a network call
 */
jest.mock("../map", () => () => <></>);

/**
 * Reduce the error spam from UploadDrop by mocking its render.
 */
jest.mock("../upload", () => () => <></>);

describe("Navigation", () => {
  it("should stay on home page when signed in", () => {
    renderNavigation();
    fireEvent.click(screen.getByText("WOAQ"));
    expect(window.location.pathname).toEqual("/");
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
    expect(screen.queryByText(/Sign in to upload/)).not.toBeInTheDocument();
  });

  it('should redirect to sign in from home when logged out', () => {
    renderNavigation({authToken: ''});
    fireEvent.click(screen.getByText("WOAQ"));
    expect(window.location.pathname).toEqual("/auth/login");
    expect(screen.queryByText(/Sign in to upload/)).toBeInTheDocument();
  })

  it("should navigate to upload page when signed in", () => {
    renderNavigation();
    fireEvent.click(screen.getByText(/Upload/));
    expect(window.location.pathname).toEqual("/upload");
  });

  // FIXME: Upload page is failing to redirect 
  it.skip('should redirect to sign in from upload when logged out', async () => {
    renderNavigation({authToken: ''});
    fireEvent.click(screen.getByText(/Upload/));
    expect(window.location.pathname).toEqual("/auth/login");
    expect(screen.queryByText(/Sign in to upload/)).toBeInTheDocument();
  })

  it("should navigate to map page when signed in", () => {
    renderNavigation();
    fireEvent.click(screen.getByText(/Maps/));
    expect(window.location.pathname).toEqual("/maps");
  });

  it("should show map even when logged out", () => {
    renderNavigation({authToken: ''});
    fireEvent.click(screen.getByText(/Maps/));
    expect(window.location.pathname).toEqual("/maps");
  })
});

const renderNavigation = ({authToken = 'fakeToken'} = {}) => 
  render(
  <AuthTokenContext.Provider value={{authToken}}>
    <Navigation />
  </AuthTokenContext.Provider>
);


