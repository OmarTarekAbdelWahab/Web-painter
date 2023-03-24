package lab.paint.paint;

import lab.paint.paint.api.PaintController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;


@SpringBootApplication
public class PaintApplication {

	public static void main(String[] args) throws IOException {
		SpringApplication.run(PaintApplication.class, args);
		//PaintController cont = new PaintController();
			//cont.save();


	}

}
