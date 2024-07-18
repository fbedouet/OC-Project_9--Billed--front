/**
 * @jest-environment jsdom
 */

import {screen, wait, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
// import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import Bills  from "../containers/Bills.js"


jest.mock("../app/Store.js", () => mockStore)

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Bills)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("when click on eye icon on bill", ()=>{
    test("display should be displayed", async ()=>{
      const modalMock = $.fn.modal = jest.fn()
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const eyeIcon = document.getElementById("eye")
      const test=document.getElementById("modaleFile")
      userEvent.click(eyeIcon)
      expect(modalMock).toHaveBeenCalledWith('show')
    })
  })
})

describe("Given I am employee",()=>{

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    //router()
    //window.onNavigate(ROUTES_PATH.Bills)
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe("when I navigate to Bill", ()=>{
    test("fetches bills from mock API GET", async ()=>{
      router()
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const testName = screen.getByText("Mes notes de frais")
      expect(testName.innerHTML).toEqual(" Mes notes de frais ")
      
    })

    test("fetches bills from an API and fails with 404 message error", async()=>{
      jest.spyOn(mockStore, "bills")
        .mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
      router()
      await new Promise(process.nextTick)
      const erreurMsg = screen.getByText(/Erreur 404/)
    })
  })
})
