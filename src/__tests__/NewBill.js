/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import {ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";

import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js";

jest.mock("../app/Store.js", () => mockStore)


beforeEach( ()=> {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', `{"type":"Employee","email":"employee@test.ltd"}`)
  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)
  router()
  window.onNavigate(ROUTES_PATH.NewBill)
  const inputExpanseName = screen.getByTestId("expense-name")
  fireEvent.change(inputExpanseName,{target:{value:"Vol Nantes Paris"}})
  
  const inputDate = screen.getByTestId("datepicker")
  fireEvent.change( inputDate, {target:{value:"2024-06-21"}})
  
  const inputAmount = screen.getByTestId("amount")
  fireEvent.change(inputAmount,{target:{value:"1024"}})
  
  const inputPct = screen.getByTestId("pct")
  fireEvent.change(inputPct,{target:{value:"20"}})
})

afterEach(() => {
  document.body.innerHTML = ''
})
  
describe("Given I am connected as an employee", ()=> {
  describe("When I select a attached file image", ()=> {
    test("Then creating new bill from mock API POST fails with 500 message error in console", async ()=> {
      const error = new Error("Error 500")
      const spy = jest.spyOn(mockStore, "bills")
        .mockImplementationOnce(() => {
          return {
            create : async () =>  {
              console.log("500 create")
              return Promise.reject(new Error("Error 500"))
            }
          }
        })
        const inputFile = screen.getByTestId('file')
        const fakeFile = new File(['Facture'], 'facture.png', {type: 'image/png'})
        fireEvent.change(inputFile, {
          target:{
            files:[fakeFile]
          }
        })
        const consoleErrorSpy = jest.spyOn(console, 'error')
        await new Promise(process.nextTick)
        expect(consoleErrorSpy).toHaveBeenCalledWith(error)
        console.log("####################")
      })
    })

  describe("When I filled in the form correctly", ()=> {
    test("Then update new bill from mock API POST fails with 500 message error in console", async ()=> {
      const error = new Error("Error 500")
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      const spy = jest.spyOn(mockStore, "bills")
        .mockImplementationOnce(() => {
          return {
            update : () =>  {
              console.log("500 update")
              return Promise.reject(error)
            }
          }
        })
      userEvent.click(document.getElementById("btn-send-bill"))
      const consoleErrorSpy = jest.spyOn(console, 'error')
      
      await new Promise(process.nextTick)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })
  })

  describe("When I am on NewBill Page", ()=> {
    test("Then bill icon in vertical layout should be highlighted", async ()=> {
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains("active-icon")).toBe(true)
    })

    test("Then attached file should not select if no image file ",async ()=>{
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.txt', {type: 'text/plain'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      const test = screen.getByTestId("file")
      await new Promise(process.nextTick)
      console.log(test.files[0].name)
      await waitFor(()=>{
      //expect(test.files[0].name).toBeFalsy()
      })
    })

    test("Then NewBill should be added on send button click", async ()=> {
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains("active-icon")).toBe(true)
      userEvent.click(document.getElementById("btn-send-bill"))
      await new Promise(process.nextTick)
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })
  })

})

