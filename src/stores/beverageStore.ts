import { defineStore } from "pinia";
import type { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";
import tempretures from "../data/tempretures.json";

export type TemperatureType = string;

export type BaseBeverageType = {
  id: string;
  name: string;
  color: string;
};

export type CreamerType = {
  id: string;
  name: string;
  color: string;
};

export type SyrupType = {
  id: string;
  name: string;
  color: string;
};

export type BeverageRecipeType = {
  id: string;
  name: string;
  temp: TemperatureType;
  base: BaseBeverageType;
  creamer: CreamerType;
  syrup: SyrupType;
  userId: string;
};

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures as TemperatureType[],
    currentTemp: tempretures[0] as TemperatureType,

    bases: [] as BaseBeverageType[],
    currBase: null as BaseBeverageType | null,

    creamers: [] as CreamerType[],
    currCreamer: null as CreamerType | null,

    syrups: [] as SyrupType[],
    currSyrup: null as SyrupType | null,

    bevName: "",
    beverages: [] as BeverageRecipeType[],
    currentBeverage: null as BeverageRecipeType | null,

    user: null as User | null,
    message: "",
    unsubscribeBeverages: null as Unsubscribe | null,
  }),

  actions: {
    async init() {
      const [basesSnap, creamersSnap, syrupsSnap] = await Promise.all([
        getDocs(collection(db, "bases")),
        getDocs(collection(db, "creamers")),
        getDocs(collection(db, "syrups")),
      ]);

      this.bases = basesSnap.docs.map((doc) => doc.data() as BaseBeverageType);
      this.creamers = creamersSnap.docs.map((doc) => doc.data() as CreamerType);
      this.syrups = syrupsSnap.docs.map((doc) => doc.data() as SyrupType);

      this.currBase = this.bases[0] ?? null;
      this.currCreamer = this.creamers[0] ?? null;
      this.currSyrup = this.syrups[0] ?? null;
    },

    setMessage(text: string) {
      this.message = text;

      setTimeout(() => {
        if (this.message === text) {
          this.message = "";
        }
      }, 5000);
    },

    setUser(user: User | null) {
      this.user = user;

      if (this.unsubscribeBeverages) {
        this.unsubscribeBeverages();
        this.unsubscribeBeverages = null;
      }

      if (!user) {
        this.beverages = [];
        this.currentBeverage = null;
        return;
      }

      const beveragesQuery = query(
        collection(db, "beverages"),
        where("userId", "==", user.uid)
      );

      this.unsubscribeBeverages = onSnapshot(beveragesQuery, (snapshot) => {
        this.beverages = snapshot.docs.map(
          (doc) => doc.data() as BeverageRecipeType
        );

        this.currentBeverage = this.beverages[0] ?? null;
      });
    },

    async makeBeverage() {
      if (!this.user) {
        this.message = "Please sign in to save your beverage.";
        return this.message;
      }

      const trimmedName = this.bevName.trim();

      if (
        !trimmedName ||
        !this.currBase ||
        !this.currCreamer ||
        !this.currSyrup ||
        !this.currentTemp
      ) {
        this.setMessage(
          "Please complete all beverage options and the name before making a beverage."
        );
        return this.message;
      }

      const beverageId = crypto.randomUUID();

      const newBeverage: BeverageRecipeType = {
        id: beverageId,
        name: trimmedName,
        temp: this.currentTemp,
        base: this.currBase,
        creamer: this.currCreamer,
        syrup: this.currSyrup,
        userId: this.user.uid,
      };

      await setDoc(doc(db, "beverages", beverageId), newBeverage);

      this.currentBeverage = newBeverage;
      this.bevName = "";
      this.setMessage(`Beverage ${trimmedName} made successfully!`);
      return this.message;
    },

    showBeverage(beverage: BeverageRecipeType) {
      this.currentBeverage = beverage;
      this.currentTemp = beverage.temp;
      this.currBase = beverage.base;
      this.currCreamer = beverage.creamer;
      this.currSyrup = beverage.syrup;
      this.bevName = beverage.name;
    }

  },

});