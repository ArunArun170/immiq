import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface ISettings extends Document {
  siteName: string;
  tagline: string;

  email: string;
  phone: string;
  address: string;

  whatsapp: string;

  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;

  googleAnalyticsId: string;
  googleSearchConsoleCode: string;

  maintenanceMode: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema =
  new Schema<ISettings>(
    {
      siteName: {
        type: String,
        default: "IMMIQ",
        trim: true,
      },

      tagline: {
        type: String,
        default:
          "CURIOSITY FIRST. TECHNOLOGY NEXT.",
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
        type: String,
        default:
          "Coimbatore, Tamil Nadu, India",
        trim: true,
      },

      whatsapp: {
        type: String,
        default: "",
        trim: true,
      },

      linkedin: {
        type: String,
        default: "",
        trim: true,
      },

      instagram: {
        type: String,
        default: "",
        trim: true,
      },

      facebook: {
        type: String,
        default: "",
        trim: true,
      },

      youtube: {
        type: String,
        default: "",
        trim: true,
      },

      twitter: {
        type: String,
        default: "",
        trim: true,
      },

      seoTitle: {
        type: String,
        default:
          "IMMIQ | Curiosity First. Technology Next.",
        trim: true,
      },

      seoDescription: {
        type: String,
        default:
          "IMMIQ is a technology company focused on corporate training, SaaS development, emerging technologies and digital services.",
        trim: true,
      },

      seoKeywords: {
        type: String,
        default:
          "IMMIQ, technology, corporate training, SaaS, emerging technology, digital services, Coimbatore",
        trim: true,
      },

      ogImage: {
        type: String,
        default: "",
        trim: true,
      },

      googleAnalyticsId: {
        type: String,
        default: "",
        trim: true,
      },

      googleSearchConsoleCode: {
        type: String,
        default: "",
        trim: true,
      },

      maintenanceMode: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<ISettings>(
  "Settings",
  settingsSchema
);