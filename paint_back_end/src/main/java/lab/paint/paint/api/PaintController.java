package lab.paint.paint.api;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.web.bind.annotation.*;
import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.*;
import java.util.ArrayList;
import java.util.Stack;

@CrossOrigin("http://localhost:4200")
@RestController
public class PaintController {
    @Autowired
    private PaintService paintService=new PaintService();
    static GraphicsConfiguration gc;

    @GetMapping("/clear")
    public void clear(){
        paintService.clear();
    }

    @GetMapping("/undo")
    public Save[] undo(){
        return paintService.undo();
    }
    @GetMapping("/redo")
    public Save[] redo(){
        return paintService.redo();
    }

    @PostMapping("/new")
    public void addnew(@RequestBody Save[] save){

        paintService.addNew(save);
    }
    @GetMapping("/save")
    public void save() throws IOException {System.out.println("save");
        Save[] save ;
        save = paintService.save();
        System.out.println(save);
        String t = "", n = "";
        // parent component of the dialog
        System.setProperty("java.awt.headless", "false");
        JFrame fe = new JFrame(gc);
        // set the size of the frame
        fe.setSize(800, 600);
        // set the frame's visibility
        fe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setPreferredSize(new Dimension(800, 600));
        fileChooser.setVisible(true);
        fe.setAlwaysOnTop(true);
        fileChooser.setDialogTitle("Specify a file to save");
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".json", "json"));
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".xml", "xml"));
        fileChooser.removeChoosableFileFilter(fileChooser.getAcceptAllFileFilter());
        int userSelection = fileChooser.showSaveDialog(fe);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToSave = fileChooser.getSelectedFile();
            t = fileChooser.getFileFilter().getDescription();
            n = fileToSave.getCanonicalPath();
            fe.remove(fileChooser);
        } else if (userSelection == JFileChooser.CANCEL_OPTION) {
            fileChooser.setVisible(false);
            fe.remove(fileChooser);
            return;
        }
        if (t.equals(".json")) {
            try {
                Gson gson = new GsonBuilder()
                        .setPrettyPrinting()
                        .create();
                FileWriter f = new FileWriter(n + t);
                gson.toJson(save, f);
                f.flush();
                f.close();

            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            try {
                FileOutputStream fos = new FileOutputStream(n + t);
                XMLEncoder encoder = new XMLEncoder(fos);
                encoder.writeObject(save);
                encoder.close();
                fos.flush();
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
            System.out.println("Saved Successfully");

    }
    @GetMapping("/load")
    public Save[] load() throws IOException {
        Save[] load ;
        String n = "", t = "";
        // parent component of the dialog
        System.setProperty("java.awt.headless", "false");
        JFrame fe = new JFrame(gc);
        // set the size of the frame
        fe.setSize(800, 600);
        // set the frame's visibility
        fe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setPreferredSize(new Dimension(800, 600));
        fileChooser.setVisible(true);
        fe.setAlwaysOnTop(true);
        fileChooser.setDialogTitle("Specify a file to save");
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".json", "json"));
        fileChooser.addChoosableFileFilter(new FileNameExtensionFilter(".xml", "xml"));
        fileChooser.removeChoosableFileFilter(fileChooser.getAcceptAllFileFilter());
        int userSelection = fileChooser.showOpenDialog(fe);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToLoad = fileChooser.getSelectedFile();
            n = fileToLoad.getCanonicalPath();
            t = fileChooser.getFileFilter().getDescription();
            //System.out.println(t);
            fe.remove(fileChooser);
            fileChooser.setVisible(false);
        } else if (userSelection == JFileChooser.CANCEL_OPTION) {
            fileChooser.setVisible(false);
            fe.remove(fileChooser);
            //res.setError(Boolean.TRUE);
            //res.setMessage("Canceled");
            return null;
        }

        if (t.equals(".json")) {
            try {
                Gson json = new Gson();
                FileReader f = new FileReader(n);
                load = json.fromJson(f, Save[].class);
                f.close();
                String y= new Gson().toJson(load);
                //res.setMessage(y);
                // res.setError(Boolean.FALSE);
                paintService.addNew(load);
                //System.out.println(load[0]);
                return load;
            } catch (IOException e) {
                e.printStackTrace();

            }
        } else {
            FileInputStream f2 = new FileInputStream(n);
            XMLDecoder mydecoder = new XMLDecoder(f2);
             load =  (Save[]) mydecoder.readObject();
            mydecoder.close();
            f2.close();
            Gson gson = new GsonBuilder()
                    .setPrettyPrinting()
                    .create();
            paintService.addNew(load);
            System.out.println(gson.toJson(load));
            return load;
        }
        return null;
    }
    }
