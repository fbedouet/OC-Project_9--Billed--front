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
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
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
  // describe("when click on eye icon on bill", ()=>{
  //   test("display should be displayed", async ()=>{
  //     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  //     localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
  //     const root = document.createElement("div")
  //     root.setAttribute("id", "root")
  //     document.body.append(root)
  //     router()
  //     window.onNavigate(ROUTES_PATH.Bills)
  //     document.body.innerHTML = BillsUI({ data: bills })
  //     await waitFor(() => screen.getByText("Mes notes de frais"))
  //     const eyeIcon = document.getElementById("eye")
  //     const test=document.getElementById("modaleFile")
  //     userEvent.click(eyeIcon)
  //     console.log(test.getAttribute("class"))
      
  //   })
  // })
  describe("when I click on eye icon on bill", ()=>{
    test("attached file should be displayed", async ()=>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      document.body.innerHTML = BillsUI({ data: [bills[0]] })
      const onNavigate =(pathname)=> {
        document.body.innerHTML = ROUTES({pathname})
      }
      const store = null
      const dashboardUser = new Bills({ document, onNavigate, store, localStorage  })
      const eye = screen.getByTestId('icon-eye')
      const icon = document.getElementById('eye')
      const handleClickIconEye = jest.fn(dashboardUser.handleClickIconEye(icon))
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()
      const modale = screen.getByTestId("modaleFileUser")
      modale.classList.add("show")
      console.log(modale.outerHTML)
    }) 
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", ()=>{
  describe("when I navigate to Bill", ()=>{
    test("fetches bills from mock API GET", async ()=>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      document.body.innerHTML = BillsUI({ data: bills })
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const testName = await screen.getByText("test1")
      expect(testName).toBeTruthy()
    })
  })
})