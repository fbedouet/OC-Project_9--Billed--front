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
  
describe("Given I am connected as an employee on new bill page", ()=> {
  describe("When I select a attached file image", ()=> {
    test("Then creating new bill from mock API POST fails with 500 message error in console", async ()=> {
      const error = new Error("Error 500")
      mockStore.setShouldRejectCreate(true)
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(()=>{})
      await new Promise(process.nextTick)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
      consoleErrorSpy.mockRestore()
      mockStore.setShouldRejectCreate(false)
    })
  })

  describe("When I filled in the form correctly", ()=> {
    test("Then update new bill from mock API POST fails with 500 message error in console", async ()=> {
      const error = new Error("Error 500")
      mockStore.setShouldRejectUpdate(true)
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      userEvent.click(document.getElementById("btn-send-bill"))
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(()=>{})
      
      await new Promise(process.nextTick)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
      consoleErrorSpy.mockRestore()
      mockStore.setShouldRejectUpdate(false)
    })
  })

  describe("When I am on NewBill Page", ()=> {
    test("Then bill icon in vertical layout should be highlighted", async ()=> {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', `{"type":"Employee","email":"employee@test.ltd"}`)
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains("active-icon")).toBe(true)
    })
  })

  describe("When I select a non-image file for a receipt ", ()=> {
    test("Then attached file should not select",async ()=>{
      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['Facture'], 'facture.txt', {type: 'text/plain'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })
      const test = screen.getByTestId("file")
      await new Promise(process.nextTick)
      expect(document.querySelector(".msgErreur").innerHTML).toBe("format incorrect")
    })
  })
  
  describe("When I send new bill by clicking on send ", ()=> {
    

    test("Then NewBill should be call POST API with create method, call PATCH API with update method, and go back to Bills page", async ()=> {
      const valeur =         {
        data: '{"type":"Transports","name":"Vol Nantes Paris","amount":1024,"date":"2024-06-21","vat":"","pct":20,"commentary":"","fileUrl":"https://localhost:3456/images/test.jpg","fileName":"","status":"pending"}',
        selector: '1234'
      }

      const createSpy = jest.spyOn(mockStore.bills(),'create')
      const updateSpy = jest.spyOn(mockStore.bills(),'update')

      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })

      await new Promise(process.nextTick)
      expect(createSpy).toBeCalled()
      expect(inputFile.files[0].type).toBe("image/png")

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementationOnce(()=>{})
      userEvent.click(document.getElementById("btn-send-bill"))

      expect(updateSpy).toHaveBeenCalledWith(valeur)
      expect(consoleLogSpy).toHaveBeenCalledWith(valeur)
      mockStore.setNewBill(JSON.parse(valeur.data))

      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
      await new Promise(process.nextTick)
      expect(screen.getByText("Vol Nantes Paris")).toBeTruthy 

      mockStore.setNewBill(null)
    })
  

    test("Then api rejected NewBill with 500 message error",async ()=>{

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', `{"type":"Employee","email":"employee@test.ltd"}`)
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const valeur =         {
        data: '{"type":"Transports","name":"Vol Nantes Paris","amount":1024,"date":"2024-06-21","vat":"","pct":20,"commentary":"","fileUrl":"https://localhost:3456/images/test.jpg","fileName":"","status":"pending"}',
        selector: '1234'
      }

      mockStore.setShouldRejectListWith404(false)
      mockStore.setShouldRejectListWith500(true)

      const createSpy = jest.spyOn(mockStore.bills(),'create')
      const updateSpy = jest.spyOn(mockStore.bills(),'update')

      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })

      await new Promise(process.nextTick)
      expect(createSpy).toBeCalled()
      expect(inputFile.files[0].type).toBe("image/png")

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementationOnce(()=>{})
      userEvent.click(document.getElementById("btn-send-bill"))

      expect(updateSpy).toHaveBeenCalledWith(valeur)
      expect(consoleLogSpy).toHaveBeenCalledWith(valeur)
      mockStore.setNewBill(JSON.parse(valeur.data))

      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
      await new Promise(process.nextTick)
      const erreurMsg = screen.getByText(/Erreur 500/)
      expect(erreurMsg).toBeTruthy()
      mockStore.setShouldRejectListWith404(false)
      mockStore.setShouldRejectListWith500(false)
    })

    test("Then api rejected NewBill with 404 message error",async ()=>{

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', `{"type":"Employee","email":"employee@test.ltd"}`)
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const valeur =         {
        data: '{"type":"Transports","name":"Vol Nantes Paris","amount":1024,"date":"2024-06-21","vat":"","pct":20,"commentary":"","fileUrl":"https://localhost:3456/images/test.jpg","fileName":"","status":"pending"}',
        selector: '1234'
      }

      mockStore.setShouldRejectListWith404(true)
      mockStore.setShouldRejectListWith500(false)

      const createSpy = jest.spyOn(mockStore.bills(),'create')
      const updateSpy = jest.spyOn(mockStore.bills(),'update')

      const inputFile = screen.getByTestId('file')
      const fakeFile = new File(['facture'], 'facture.png', {type: 'image/png'})
      fireEvent.change(inputFile, {
        target:{
          files:[fakeFile]
        }
      })

      await new Promise(process.nextTick)
      expect(createSpy).toBeCalled()
      expect(inputFile.files[0].type).toBe("image/png")

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementationOnce(()=>{})
      userEvent.click(document.getElementById("btn-send-bill"))

      expect(updateSpy).toHaveBeenCalledWith(valeur)
      expect(consoleLogSpy).toHaveBeenCalledWith(valeur)
      mockStore.setNewBill(JSON.parse(valeur.data))

      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
      await new Promise(process.nextTick)
      const erreurMsg = screen.getByText(/Erreur 404/)
      expect(erreurMsg).toBeTruthy()
      mockStore.setShouldRejectListWith404(false)
      mockStore.setShouldRejectListWith500(false)
    })
  })

})